import { SVGAttributes } from 'react';

export default function ApplicationLogo({ className = 'h-16 w-auto' }: { className?: string }) {
    return (
        <img
            src="/images/saf_league_logo.png"
            alt="SAF League"
            className={`${className} object-contain drop-shadow-md`}
        />
    );
}
