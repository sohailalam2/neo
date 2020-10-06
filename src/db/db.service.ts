import { Injectable } from '@nestjs/common';
import * as Loki from 'lokijs';

@Injectable()
export class DbService {
  private readonly db: Loki;
  private readonly collection: Loki.Collection;

  constructor() {
    this.db = new Loki('neo.db');
    this.collection = this.db.addCollection('collection');
  }

  async insert<T>(data: T): Promise<T> {
    return this.collection.insert(data);
  }

  async find<T>(keyName?: string, value?: string | string[]): Promise<T> {
    if (!keyName) {
      return this.collection.find() as any;
    }

    if (!value) {
      return this.collection.find({ [keyName]: { $exists: true } }) as any;
    }

    if (Array.isArray(value)) {
      return this.collection.find({ [keyName]: { $in: value } }) as any;
    }

    return this.collection.findOne({ [keyName]: value });
  }

  async filterAndUpdate<T>(
    filter: Record<string, any>,
    updateFn: (obj: any) => any,
  ): Promise<void> {
    return this.collection.findAndUpdate(filter, updateFn);
  }

  async remove(keyName?: string, value?: string | string[]): Promise<void> {
    if (Array.isArray(value)) {
      return this.collection.removeWhere({ [keyName]: { $in: value } });
    }

    return this.collection.removeWhere({ [keyName]: value });
  }
}
