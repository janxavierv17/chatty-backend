import bunyan from "bunyan";

export const createLogger = (name: string) =>
    bunyan.createLogger({ name, level: "debug" });
