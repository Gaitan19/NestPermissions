/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
    private logger;
    constructor(private readonly httpService: HttpService,) {
        this.logger = new Logger();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const { user, method, path, params } = context.switchToHttp().getRequest();

        if (user.rols.includes('admin')) {
            return true;
        }

        const endpoint = path.replace(`/${params.id}`, '');

        console.log('endpoint :>> ', endpoint);
        const response = await firstValueFrom(
            this.httpService.post(`http://localhost:4001/permissions/check`, { endpoint, method, roles: user.rols })
        );

        return response.data;

    }
}
