"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function PrivateRoute({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (!isPending && !session?.user) {
            router.replace(
                `/login?callbackUrl=${encodeURIComponent(pathname)}`
            );
        }
    }, [isPending, session?.user, pathname, router]);

    if (isPending || !session?.user) {
        return (
            <main className="min-h-screen py-24 text-center text-slate-500">
                Checking authentication...
            </main>
        );
    }

    return children;
}
