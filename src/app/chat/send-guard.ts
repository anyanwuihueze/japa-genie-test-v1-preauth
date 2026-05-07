export function shouldBlockChatSubmit(input: string, isTyping: boolean): boolean {
  return !input.trim() || isTyping;
}
