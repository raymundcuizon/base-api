import { ApiProperty } from '@nestjs/swagger';

export class SigninResponseDTO {
  @ApiProperty() type?: string;
  @ApiProperty() accessToken: string;
  @ApiProperty() refreshToken: string;
  @ApiProperty() email: string;
  @ApiProperty() firstname: string;
  @ApiProperty() lastname: string;
  @ApiProperty() username: string;
  @ApiProperty() userType: string;
}

export class SigninResponseNeedToactivateDTO {
  @ApiProperty() type: string;
  @ApiProperty() activationCode: string;
}
