declare module "dhtmlx-gantt" {
  interface GanttConfig {
    rtl: boolean;
    row_height: number;
    font_family: string;
    date_format: string;
    min_column_width: number;
    autosize: string;
    fit_tasks: boolean;
    show_progress: boolean;
    scale_height: number;
    scales: Array<{
      unit: string;
      step: number;
      format: string;
    }>;
    columns: Array<{
      name: string;
      label?: string;
      tree?: boolean;
      width: number;
      align?: string;
      template?: (task: any) => string;
    }>;
    // Add the additional properties used in the Form
    smart_rendering: boolean;
    smart_scales: boolean;
    show_task_cells: boolean;
    static_background: boolean;
  }

  interface GanttStatic {
    config: GanttConfig;
    init(container: HTMLElement): void;
    parse(data: { data: any[]; links: any[] }): void;
    clearAll(): void;
    ext: {
      zoom: {
        setLevel(level: string): void;
      };
    };
    showDate(date: Date): void;
    render(): void;

    // Add additional methods used in the Form
    templates: {
      task_class: (start: Date, end: Date, task: any) => string;
      link_class: (link: any) => string;
      [key: string]: any;
    };
    attachEvent(name: string, handler: Function): void;
    detachEvent(id: any): void;
  }

  export const gantt: GanttStatic;
}
