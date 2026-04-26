import { ReactLenis } from '@studio-freight/react-lenis';

export const LenisScroll = ({ children }) => {
    return (
        <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothTouch: true }}>
            {children}
        </ReactLenis>
    );
};
