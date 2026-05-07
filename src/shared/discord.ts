export interface DiscordVoiceUser {
  userId: string;
  nick: string;
  username: string;
  avatarUrl: string | null;
  speaking: boolean;
  muted: boolean;
  deaf: boolean;
  selfMuted: boolean;
  selfDeaf: boolean;
}

export interface DiscordVoiceState {
  connected: boolean;
  channelId: string | null;
  channelName: string | null;
  guildId: string | null;
  guildName: string | null;
  users: DiscordVoiceUser[];
  selfUserId: string | null;
  error?: string;
}
