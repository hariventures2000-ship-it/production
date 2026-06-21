import { Module } from '@nestjs/common';
import { OllamaProvider } from '../../ai/providers/ollama.provider';

export const AI_PROVIDER = 'AI_PROVIDER';

@Module({
  providers: [
    {
      provide: AI_PROVIDER,
      useClass: OllamaProvider,
    },
    OllamaProvider,
  ],
  exports: [AI_PROVIDER, OllamaProvider],
})
export class AiModule {}
