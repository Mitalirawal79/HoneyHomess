import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  // ✅ ADD PROFILE STATE
  const [profile, setProfile] = useState(null);

  // ✅ ADD FETCH PROFILE FUNCTION
  const fetchProfile = async (userId) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error) {
      setProfile(data);
    }
  };

  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching user roles:", error);
        return null;
      }

      const roles = data.map((r) => r.role);

      if (roles.includes("admin")) return "admin";
      if (roles.includes("technician")) return "technician";
      return "user";
    } catch (error) {
      console.error("Error fetching user roles:", error);
      return null;
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        setTimeout(() => {
          fetchUserRole(session.user.id).then(setRole);
          fetchProfile(session.user.id); // ✅ ADD THIS
        }, 0);
      } else {
        setRole(null);
        setProfile(null); // ✅ CLEAR PROFILE ON LOGOUT
      }

      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserRole(session.user.id).then(setRole);
        fetchProfile(session.user.id); // ✅ ADD THIS
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, fullName, phone) => {
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          phone: phone,
        },
      },
    });

    return { error: error || null };
  };

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error: error || null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
    setProfile(null); // ✅ CLEAR PROFILE
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        role,
        profile,        // ✅ EXPOSE PROFILE
        fetchProfile,   // ✅ EXPOSE FETCH
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
