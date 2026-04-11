export abstract class BaseMapper<TDomain, TDoc> {

    abstract toDomain(doc: TDoc): TDomain;

    abstract toPersistence(domain: TDomain): Partial<TDoc>;

    toDomainList(docs: TDoc[]): TDomain[] {
        return docs.map(doc => this.toDomain(doc));
    }

    toPersistenceList(domains: TDomain[]): Partial<TDoc>[] {
        return domains.map(domain => this.toPersistence(domain));
    }
}