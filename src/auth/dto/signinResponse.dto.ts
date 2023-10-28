import { ApiProperty } from '@nestjs/swagger';

export class SigninResponseDTO {
  @ApiProperty() type?: string;
  @ApiProperty() accessToken: string;
  @ApiProperty() refreshToken: string;
}

export class SigninResponseNeedToactivateDTO {
  @ApiProperty() type: string;
  @ApiProperty() id: number;
}
