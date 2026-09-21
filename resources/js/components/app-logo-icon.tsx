import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <g fill="none" stroke="currentColor" strokeWidth="2.5">
                <ellipse
                    cx="15"
                    cy="22"
                    rx="10"
                    ry="12"
                    transform="rotate(-22 15 22)"
                />
                <ellipse
                    cx="25"
                    cy="22"
                    rx="10"
                    ry="12"
                    transform="rotate(22 25 22)"
                />
                <path d="m20 3 3 4-3 4-3-4Z" strokeWidth="1.5" />
            </g>
        </svg>
    );
}
