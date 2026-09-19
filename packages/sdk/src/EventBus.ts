export type EventListener<T> = (event: T) => void;

export class EventBus<T> {
    private readonly listeners: Set<EventListener<T>> = new Set();

    public subscribe(listener: EventListener<T>): () => void {
        this.listeners.add(listener);
        return () => this.unsubscribe(listener);
    }

    public unsubscribe(listener: EventListener<T>): void {
        this.listeners.delete(listener);
    }
    
    public emit(event: T): void {
        for (const listener of this.listeners)
        {
            try{
                listener(event);
            } catch (error) {
                console.error('Error occurred while emitting event:', error);
            }
        }
    }

    public clear(): void {
        this.listeners.clear();
    }

    public get listenerCount(): number {
    return this.listeners.size;
     }


}