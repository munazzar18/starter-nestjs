import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];
        if (token) {
            try {
                const decoded = this.jwtService.verify(token);
                request.user = decoded
                return true
            } catch (error) {
                console.error("Token verification error", error)
                return false
            }
        }
        else {

            return false
        }
    }
}