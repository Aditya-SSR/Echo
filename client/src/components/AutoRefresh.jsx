"use client";
import { useEffect } from "react";


export default function AutoRefresh({ refreshData }) {

    useEffect(() => {
        const interval = setInterval(() => {
  
            refreshData(); 
        }, 20000); 

        return () => clearInterval(interval);
    }, [refreshData]);

    return null;
}