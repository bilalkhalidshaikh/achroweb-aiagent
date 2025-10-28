import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mic2, Sparkles } from "lucide-react";

interface VapiModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VapiModal({ open, onOpenChange }: VapiModalProps) {
  const vapiUrl = "https://vapi.ai?demo=true&shareKey=738a9d89-3707-4f15-b1bd-836557d10561&assistantId=8c95d084-15b5-4593-a770-bc1091b2d414";

  const handleLaunch = () => {
    window.open(vapiUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-glass-border max-w-md" data-testid="modal-vapi">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display flex items-center gap-2">
            <Mic2 className="w-6 h-6 text-primary" />
            Voice AI Assistant
          </DialogTitle>
          <DialogDescription className="text-base">
            Experience Achroweb's intelligent booking assistant powered by Vapi
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-4">
          <div className="glass p-4 rounded-lg border border-glass-border">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              What it can do:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1.5 ml-6 list-disc">
              <li>Schedule appointments via natural conversation</li>
              <li>Answer questions about services</li>
              <li>Reschedule or cancel bookings</li>
              <li>Provide availability information</li>
            </ul>
          </div>

          <Button
            onClick={handleLaunch}
            size="lg"
            className="w-full gap-2 glow-primary"
            data-testid="button-launch-vapi-external"
          >
            <ExternalLink className="w-5 h-5" />
            Launch Voice Assistant
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Opens in a new window. Ensure your microphone is enabled.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
