import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class TelegramService {
  private botToken: string
  private apiUrl: string

  constructor(private config: ConfigService) {
    this.botToken = config.get('TELEGRAM_BOT_TOKEN')!
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`
  }

  async sendMessage(chatId: string, text: string) {
    try {
      await fetch(`${this.apiUrl}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
        }),
      })
    } catch (err) {
      console.error('Telegram error:', err)
    }
  }
}