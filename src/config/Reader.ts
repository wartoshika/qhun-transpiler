import { Project } from "./Project";

export interface Reader {

    /**
     * reads the given data and output a project object
     */
    read(): Project;
}
