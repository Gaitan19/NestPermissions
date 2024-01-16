/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/rols.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        // const request = context.switchToHttp().getRequest();
        // const method = request.method;
        // const handler = context.getHandler().toString();
        const { user, method } = context.switchToHttp().getRequest();

        // console.log('handler :>> ', handler);


        const handler = context.getHandler();
        // Obtener el nombre del controlador y del método
        // const controllerName = controllerMetadata ? controllerMetadata.replace(/\//g, '') : 'N/A';
        const methodName = handler.name || 'N/A';

        console.log('Nombre de la función que se está ejecutando:', `${methodName}`);



        // console.log('Método de la petición en el guardia:', method);
        // return user.role === requiredRoles;
        return requiredRoles.some((requiredRole) => user.rols.includes(requiredRole));
    }
}
