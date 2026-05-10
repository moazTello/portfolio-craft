import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from './auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private config: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: config.get('GITHUB_CLIENT_ID')!,
      clientSecret: config.get('GITHUB_CLIENT_SECRET')!,
    //   callbackURL: `${config.get('BACKEND_URL') ?? 'http://localhost:3001'}/v1/auth/github/callback`,
      callbackURL: `${config.get('BACKEND_URL')}/v1/auth/github/callback`,
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    const email = profile.emails?.[0]?.value;
    const avatar = profile.photos?.[0]?.value;

    const user = await this.authService.findOrCreateOAuthUser({
      email,
      name: profile.displayName || profile.username,
      oauthProvider: 'github',
      oauthId: profile.id,
      avatarUrl: avatar,
    });

    done(null, user);
  }
}
