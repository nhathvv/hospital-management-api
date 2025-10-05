import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class ExceptionUtils {
  static throwNotFound(message = 'Resource not found'): never {
    throw new NotFoundException(message);
  }

  static throwBadRequest(message = 'Bad request'): never {
    throw new BadRequestException(message);
  }

  static throwForbidden(message = 'Forbidden'): never {
    throw new ForbiddenException(message);
  }

  static throwUnauthorized(message = 'Unauthorized'): never {
    throw new UnauthorizedException(message);
  }

  static throwInternalServerError(message = 'Internal server error'): never {
    throw new InternalServerErrorException(message);
  }
}
