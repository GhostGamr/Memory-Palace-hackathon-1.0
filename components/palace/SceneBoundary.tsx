"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

/**
 * Without this, any failure inside the R3F canvas (no WebGL context, driver
 * shader failure, bad geometry args) leaves an empty transparent box with the
 * 2D HUD still on top, which reads as "the app is broken" with no clue why.
 */
export default class SceneBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Palace 3D scene failed to render:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="absolute inset-0 z-10 grid place-items-center p-6">
          <div className="max-w-md rounded-xl border border-rose-300/30 bg-slate-950/90 p-4 text-left">
            <p className="text-xs font-semibold tracking-widest text-rose-300 uppercase">
              3D scene failed
            </p>
            <p className="mt-2 text-sm text-slate-200">{this.state.error.message}</p>
            <p className="mt-2 text-xs text-slate-400">
              This usually means WebGL is unavailable or blocked. Enable hardware
              acceleration, then reload.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
