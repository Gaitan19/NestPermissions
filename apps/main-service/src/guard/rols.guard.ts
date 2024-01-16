/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
    private logger;
    constructor( private readonly httpService: HttpService,) { 
        this.logger = new Logger();
    }

    async canActivate(context: ExecutionContext):Promise <boolean> {

        const { user, method } = context.switchToHttp().getRequest();

        const response = await firstValueFrom(
            this.httpService.post(`http://localhost:4001/users/userPermissions`, { email:user.email })
        );

        const userPermissions = response.data;

        if (user.rols.includes('admin')) {
            return true;
        }

// [['GET','PATCH']]
// [[],[]]
        const hasRequiredPermission = userPermissions.some((permissions) => permissions.map((permission)=>permission.toUpperCase()).includes(method));
        if(hasRequiredPermission) return true 


        return false;

    }
}
