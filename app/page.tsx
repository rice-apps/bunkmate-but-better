import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { createClient } from '@/utils/supabase/server';

export default async function Index() {
    const supabase = createClient();
    const { data: listings } = await supabase.from("listings").select();

    return <pre>{JSON.stringify(listings, null, 2)}</pre>

    return (
        <>
            {/* <Hero />
            <main className="flex-1 flex flex-col gap-6 px-4">
                <h2 className="font-medium text-xl mb-4">Next steps</h2>
                {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
            </main> */}

        </>
    );
}
