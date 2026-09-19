export class RingBuffer<T> {
    private readonly buffer: T[]=[];
    public readonly limit: number;
    private head: number = 0;
    private count: number = 0;

    constructor (limit: number = 500) {
        if( limit <= 0 || !Number.isInteger(limit) ) {
            throw new Error('Limit must be a positive integer');
        }
        this.limit = limit;
    }

    public push(item: T): void {
      const writeIndex =  (this.head + this.count) % this.limit;
      this.buffer[writeIndex] = item;
      if (this.count < this.limit) {
        this.count++;
      } else {
        this.head = (this.head + 1) % this.limit;
      }
    }

   public getAll(): T[] {
    const snapshot: T[] = new Array(this.count);
    for (let i = 0; i < this.count; i++) {
      const readIndex = (this.head + i) % this.limit;
      snapshot[i] = this.buffer[readIndex] as T;
    }
    return snapshot;
  }

  public clear(): void {
    this.head = 0;
    this.count = 0;
    this.buffer.length = 0; // Clear the buffer array
  }

  public get size(): number {
    return this.count;
  }

  public get isFull(): boolean {
    return this.count >= this.limit;
  }

}