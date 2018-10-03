import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

import {SERVER_API_URL} from 'app/app.constants';
import {createRequestOption} from 'app/shared';
import {IExchangeEntry} from 'app/shared/model/exchange-entry.model';

type EntityResponseType = HttpResponse<IExchangeEntry>;
type EntityArrayResponseType = HttpResponse<IExchangeEntry[]>;

@Injectable({ providedIn: 'root' })
export class ExchangeEntryService {
    private resourceUrl = SERVER_API_URL + 'api/exchange-entries';

    constructor(private http: HttpClient) {}

    create(exchangeEntry: IExchangeEntry): Observable<EntityResponseType> {
        return this.http.post<IExchangeEntry>(this.resourceUrl, exchangeEntry, { observe: 'response' });
    }

    update(exchangeEntry: IExchangeEntry): Observable<EntityResponseType> {
        return this.http.put<IExchangeEntry>(this.resourceUrl, exchangeEntry, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IExchangeEntry>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IExchangeEntry[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    deleteByIds(ids: number[]): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/batched/${ids.join(',')}`, { observe: 'response' });
    }
}
