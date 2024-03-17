// transform.interceptor.ts

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();
        const serverBaseUrl = `${request.protocol}://${request.get('host')}`;

        return next.handle().pipe(
            map(data => {
                if (this.isProductResponse(data)) {
                    return this.transformProductData(data, serverBaseUrl);
                }
                return data;
            }),
        );
    }

    private isProductResponse(data: any): boolean {
        return Array.isArray(data) && data.length > 0 && 'images' in data[0];
    }

    private transformProductData(data: any, serverBaseUrl: string): any {
        if (Array.isArray(data)) {
            return data.map(product => this.transformProductImages(product, serverBaseUrl));
        } else {
            return this.transformProductImages(data, serverBaseUrl);
        }
    }

    private transformProductImages(product: any, serverBaseUrl: string): any {
        if (product.images && Array.isArray(product.images)) {
            product.images = product.images.map((img: string) => `${serverBaseUrl}${img}`);
        }
        return product;
    }
}
