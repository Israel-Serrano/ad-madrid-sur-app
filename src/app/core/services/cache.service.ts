import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

/**
 * Servicio de caché genérico para cualquier tipo de datos
 * Reduce consultas redundantes a Firestore
 * 
 * Uso:
 * this.cacheService.get('teams', () => this.teamsApi.fetch())
 */
@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutos por defecto

  constructor() { }

  /**
   * Obtiene datos del caché o ejecuta función para obtenerlos
   * @param key Clave única para el caché
   * @param fetcher Función que obtiene los datos (retorna Observable)
   * @param ttl Tiempo de vida del caché en ms (default: 5 min)
   */
  get<T>(key: string, fetcher: () => Observable<T>, ttl: number = this.defaultTTL): Observable<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    // Si existe en caché y no ha expirado
    if (cached && (now - cached.timestamp) < cached.ttl) {
      return of(cached.data);
    }

    // Sino, obtener del servidor y cachear
    return fetcher().pipe(
      tap(data => {
        this.cache.set(key, { data, timestamp: now, ttl });
      }),
      shareReplay(1)
    );
  }

  /**
   * Invalida un caché específico
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalida todos los cachés
   */
  invalidateAll(): void {
    this.cache.clear();
  }

  /**
   * Obtiene estado actual del caché (para debugging)
   */
  getStatus(): { keys: string[]; size: number } {
    return {
      keys: Array.from(this.cache.keys()),
      size: this.cache.size
    };
  }
}
