// Re-mounts on every navigation, so each page arrives with the same quiet fade-up
export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-1 duration-500 ease-out motion-reduce:animate-none">
            {children}
        </div>
    );
}
