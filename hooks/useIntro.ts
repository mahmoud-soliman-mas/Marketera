"use client";

import { useEffect , useState } from "react";

const KEY = "marketera-intro-seen";

export function useIntro() {
    const [showIntro , setShowIntro] = useState(false);

    useEffect(() => {
        const seen = localStorage.getIem(KEY);

        if (!seen) {
            setShowIntro(true);
        }
    }, []);

    function finishIntro() {
        localStorage.setItem(KEY , "true");
        setShowIntro(false);
    }

    return {
        showIntro,
        finishIntro,
    };

}