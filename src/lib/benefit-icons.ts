import {
  CheckCircle2,
  Award,
  Target,
  TrendingUp,
  Users,
  Clock,
  Star,
  ShieldCheck,
  Lightbulb,
  Rocket,
  Handshake,
  Trophy,
  BookOpen,
  Heart,
  Zap,
  Globe,
  type LucideIcon,
} from "lucide-react";

export const BENEFIT_ICONS: Record<string, LucideIcon> = {
  check: CheckCircle2,
  award: Award,
  target: Target,
  trending: TrendingUp,
  users: Users,
  clock: Clock,
  star: Star,
  shield: ShieldCheck,
  idea: Lightbulb,
  rocket: Rocket,
  handshake: Handshake,
  trophy: Trophy,
  book: BookOpen,
  heart: Heart,
  zap: Zap,
  globe: Globe,
};

export const BENEFIT_ICON_NAMES = Object.keys(BENEFIT_ICONS);

export function getBenefitIcon(name: string): LucideIcon {
  return BENEFIT_ICONS[name] ?? CheckCircle2;
}
