import * as React from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  onPlayAudio?: () => void;
  isRecording?: boolean;
  isPlaying?: boolean;
  hasAudio?: boolean;
  className?: string;
  variant?: 'record' | 'play' | 'both';
}

const VoiceButton = React.forwardRef<HTMLButtonElement, VoiceButtonProps>(
  ({ 
    onStartRecording, 
    onStopRecording, 
    onPlayAudio, 
    isRecording = false, 
    isPlaying = false, 
    hasAudio = false,
    className,
    variant = 'record',
    ...props 
  }, ref) => {
    
    if (variant === 'play' || (variant === 'both' && hasAudio)) {
      return (
        <Button
          ref={ref}
          variant="cultural"
          size="sm"
          onClick={onPlayAudio}
          className={cn(
            "relative overflow-hidden group",
            isPlaying && "voice-pulse",
            className
          )}
          {...props}
        >
          <Volume2 className="h-4 w-4" />
          {isPlaying && (
            <div className="absolute inset-0 bg-primary/20 animate-pulse rounded-md" />
          )}
        </Button>
      );
    }

    return (
      <Button
        ref={ref}
        variant={isRecording ? "destructive" : "cultural"}
        size="sm"
        onClick={isRecording ? onStopRecording : onStartRecording}
        className={cn(
          "relative overflow-hidden group transition-all duration-300",
          isRecording && "voice-recording shadow-glow",
          className
        )}
        {...props}
      >
        {isRecording ? (
          <Square className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
        {isRecording && (
          <div className="absolute inset-0 bg-gradient-radial from-destructive/30 to-transparent animate-ping" />
        )}
      </Button>
    );
  }
);

VoiceButton.displayName = "VoiceButton";

export { VoiceButton };