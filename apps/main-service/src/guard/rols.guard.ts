/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { ROLES_KEY } from '../decorators/rols.decorator';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
    private logger;
    // private reflector: Reflector,
    constructor( private readonly httpService: HttpService,) { 
        this.logger = new Logger();
    }

    async canActivate(context: ExecutionContext):Promise <boolean> {
        // const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
        //     context.getHandler(),
        //     context.getClass(),
        // ]);

        const { user, method } = context.switchToHttp().getRequest();

        const response = await firstValueFrom(
            this.httpService.post(`http://localhost:4001/users/userPermissions`, { email:user.email })
        );

        const userPermissions = response.data;
        console.log('userPermissions :>> ', userPermissions);
        // console.log('user :>> ', user);

        if (user.rols.includes('admin')) {
            return true;
        }

        // const request = context.switchToHttp().getRequest();
        // const method = request.method;
        // const handler = context.getHandler().toString();
       

        // console.log('handler :>> ', handler);


        // const handler = context.getHandler();
        // Obtener el nombre del controlador y del método
        // const controllerName = controllerMetadata ? controllerMetadata.replace(/\//g, '') : 'N/A';
        // const methodName = handler.name || 'N/A';

        // console.log('Nombre de la función que se está ejecutando:', `${methodName}`);

        const hasRequiredPermission = userPermissions.some((permissions) => permissions.map((permission)=>permission.toUpperCase()).includes(method));
        if(hasRequiredPermission) return true 



        return false;


        // console.log('has :>> ', hasRequiredPermission);

            // console.log('user :>> ', user);
        // console.log('Método de la petición en el guardia:', method);
        // return user.role === requiredRoles;
        // return requiredRoles.some((requiredRole) => user.rols.includes(requiredRole));
    }
}
