import Image from "next/image";

// A calm, deterministic tint per name: dark tinted fill, light tinted letter.
function hueFor(name) {
    let h = 0;
    for (const ch of name) h = (h * 31 + ch.codePointAt(0)) % 360;
    return h;
}

export default function Avatar({ name = "?", admin = false, size = 40 }) {
    if (admin) {
        return (
            <Image
                src="/Lynxx.png"
                alt=""
                width={size}
                height={size}
                unoptimized
                className="shrink-0 rounded-full bg-raised object-cover"
                style={{ width: size, height: size }}
            />
        );
    }

    const initial = (name.trim().charAt(0) || "?").toUpperCase();
    const hue = hueFor(name);

    return (
        <span
            aria-hidden="true"
            className="inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold"
            style={{
                width: size,
                height: size,
                fontSize: Math.round(size * 0.42),
                background: `hsl(${hue} 32% 20%)`,
                color: `hsl(${hue} 75% 80%)`,
            }}
        >
            {initial}
        </span>
    );
}
