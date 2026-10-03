"use client";
import { Button } from "@/components/ui/button";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type ConfirmOptions = {
    title: string;
    description?: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    /** "danger" paints the confirm button red, for actions that delete something. */
    tone?: "default" | "danger";
};

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

/** Promise-based confirm: `if (await confirm({ title: "Remove?" })) …` */
export function useConfirm() {
    const ctx = useContext(ConfirmContext);
    if (!ctx) throw new Error("useConfirm must be used inside <ConfirmProvider>");
    return ctx;
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const resolveRef = useRef<((value: boolean) => void) | null>(null);
    const [options, setOptions] = useState<ConfirmOptions | null>(null);

    const confirm = useCallback<ConfirmFn>((opts) => {
        // Settle any dialog that's still pending before opening a new one
        resolveRef.current?.(false);
        setOptions(opts);
        return new Promise<boolean>((resolve) => {
            resolveRef.current = resolve;
        });
    }, []);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (options && dialog && !dialog.open) dialog.showModal();
    }, [options]);

    const settle = (value: boolean) => {
        resolveRef.current?.(value);
        resolveRef.current = null;
        dialogRef.current?.close();
    };

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            <dialog
                ref={dialogRef}
                className="confirm-dialog m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-line bg-card p-0 text-ink shadow-lift"
                aria-labelledby="confirm-title"
                aria-describedby={options?.description ? "confirm-description" : undefined}
                // Esc and backdrop clicks both count as "cancel"
                onClose={() => {
                    resolveRef.current?.(false);
                    resolveRef.current = null;
                }}
                onClick={(e) => {
                    if (e.target === e.currentTarget) settle(false);
                }}
            >
                {options && (
                    <div className="p-6 sm:p-7">
                        <h2 id="confirm-title" className="text-2xl leading-tight">{options.title}</h2>
                        {options.description && (
                            <p id="confirm-description" className="mt-2 text-sm leading-relaxed text-ink-muted">
                                {options.description}
                            </p>
                        )}
                        <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <Button variant="ghost" onClick={() => settle(false)} autoFocus>
                                {options.cancelLabel ?? "Cancel"}
                            </Button>
                            <Button variant={options.tone === "danger" ? "destructive" : "default"} onClick={() => settle(true)}>
                                {options.confirmLabel ?? "Confirm"}
                            </Button>
                        </div>
                    </div>
                )}
            </dialog>
        </ConfirmContext.Provider>
    );
}
