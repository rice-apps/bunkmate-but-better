import * as React from "react";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";


export default function dummyRoute() {
    const router = useRouter();
    const goToHome = () => {
        router.push('/page');
        console.log("page routing success")
    };
    return (
        <main className = "flex-1 flex flex-col gap-6 px-4">
            <h2 className="font-medium text-x1 mb-4"> Main Page</h2>
            <Button onClick={goToHome}>Go to Home Page</Button>
        </main>
    );
}