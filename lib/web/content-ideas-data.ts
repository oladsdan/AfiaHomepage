export interface VideoTypeOption {
  id: string;
  label: string;
}

export const videoTypes: VideoTypeOption[] = [
  { id: "storytime", label: "Storytime" },
  { id: "grwm", label: "GRWM" },
  { id: "pov", label: "POV" },
  { id: "comedy-skit", label: "Comedy Skit" },
  { id: "talking-head", label: "Talking Head" },
  { id: "tutorial", label: "Tutorial" },
  { id: "list-video", label: "List Video" },
  { id: "vlog", label: "Vlog" },
  { id: "reaction", label: "Reaction" },
  { id: "educational", label: "Educational" },
];
