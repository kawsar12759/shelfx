import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
const Hero = () => {
    return (
        <section className="relative overflow-hidden border-b border-[#DAD3C8]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FAF7F3] via-[#F4EFE9] to-[#EFE7DE]" />
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#E6D8C8]/40 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#EADFD3]/40 blur-3xl" />
            <div className="relative container mx-auto px-4 py-24">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <div className="flex justify-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#DAD3C8] bg-white/70 px-4 py-1.5 text-sm font-medium text-[#6B4F3F] shadow-sm backdrop-blur">
                            <span className="h-2 w-2 rounded-full bg-[#6B4F3F]" />
                            A digital sanctuary for readers
                        </span>
                    </div>
                    <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground">
                        Welcome to{" "}
                        <span className="relative inline-block">
                            <span className="relative z-10 text-[#6B4F3F]">ShelfX</span>
                            <span className="absolute -bottom-2 left-0 right-0 h-4 rounded-full bg-[#E6D8C8]/70 blur-[1px]" />
                        </span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg md:text-xl text-[#847062] leading-relaxed">
                        Discover, share, and discuss timeless stories and modern ideas with
                        passionate readers from around the world.
                    </p>

                    <div className="flex justify-center pt-4">
                        <Button
                            asChild
                            size="lg"
                            className="group gap-2 rounded-full px-8 text-base shadow-md transition-all hover:shadow-lg"
                        >
                            <Link href="/explore">
                                Explore all books
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
