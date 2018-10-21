import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

import {SERVER_API_URL} from 'app/app.constants';
import {createRequestOption} from 'app/shared';
import {ICurrency} from 'app/shared/model/currency.model';
import {IAutocompleteable, IAutocompleteService} from 'app/entities/entity.module';

type EntityResponseType = HttpResponse<ICurrency>;
type EntityArrayResponseType = HttpResponse<ICurrency[]>;

@Injectable({ providedIn: 'root' })
export class CurrencyService implements IAutocompleteService {
    private resourceUrl = SERVER_API_URL + 'api/currencies';

    constructor(private http: HttpClient) {}

    create(currency: ICurrency): Observable<EntityResponseType> {
        return this.http.post<ICurrency>(this.resourceUrl, currency, { observe: 'response' });
    }

    update(currency: ICurrency): Observable<EntityResponseType> {
        return this.http.put<ICurrency>(this.resourceUrl, currency, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ICurrency>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ICurrency[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    deleteByIds(ids: number[]): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/batched/${ids.join(',')}`, { observe: 'response' });
    }

    getAutocompleteObservable(req?: any): Observable<HttpResponse<IAutocompleteable[]>> {
        const options = createRequestOption(req);
        return this.http.get<IAutocompleteable[]>(this.resourceUrl, { params: options, observe: 'response' });
    }
}
