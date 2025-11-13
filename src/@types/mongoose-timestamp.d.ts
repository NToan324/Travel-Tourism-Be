declare module "mongoose-timestamp" {
  import { type Schema } from "mongoose";

  interface TimestampOptions {
    createdAt?: string;
    updatedAt?: string;
  }

  function mongooseTimestamp(schema: Schema, options?: TimestampOptions): void;

  export = mongooseTimestamp;
}
