import { saveAs } from "file-saver";

export interface ExportedTour {
  projectLocation: string;
  reportedBy: string;
  reportedAt: string;
  numberOfOpenTasks: number;
  tourUrl?: string;
  planUrl?: string;
}

const generateHtmlTourSection = (tourUrl?: string): string => {
  if (tourUrl) {
    return `<div>
        <div class="castory-section">
          <div class="castory-section__title">
            <div class="material-icons pr-2">image</div>
            <span
              >
              <a
                target="_blank"
                href="${tourUrl}"
                >View floor 360° documentation</a
              ></span
            >
          </div>
          <br />
          <iframe
            src="${tourUrl}"
            width="90%"
            height="700"
          ></iframe>
        </div>
      </div>`;
  }
  return "";
};

const generateHtmlPlanSection = (planUrl?: string): string => {
  if (planUrl) {
    return `
    <div>
        <div class="castory-section">
          <div class="castory-section__title">
            <div class="material-icons pr-2">map</div>
            <span
              >
              <a
                target="_blank"
                href="${planUrl}"
                >View marked floor plan</a
              ></span
            >
          </div>
          <br />
          <iframe
            src="${planUrl}"
            width="90%"
            height="700"
          ></iframe>
        </div>
      </div>
    `;
  }
  return "";
};

const generateHtmlReportContent = (exportedTour: ExportedTour) =>
  `<html>
  <head>
    <meta charset="utf-8" />
    <title>${exportedTour.projectLocation}</title>

    <link
      href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp"
      rel="stylesheet"
    />
    <style type="text/css">
      .castory-body {
        font-family: Tahoma, Verdana, Segoe, sans-serif;
        font-size: 16px;
        margin: 1rem;
        white-space: nowrap;
      }
      .castory-section {
        display: flex;
        flex-direction: column;
        padding: 1rem;
        overflow: hidden;
        break-inside: avoid-column;
      }
      .castory-section__title {
        display: flex;
        align-items: center;
        width: 100%;
        margin-bottom: 0.25rem;
        color: #0054ff;
      }
      .castory-section__title--main {
        display: flex;
        width: 100%;
        font-size: 20px;
        font-weight: 600;
      }
      .castory-multi-columns {
        column-count: 2;
      }
      .castory-properties {
        font-size: 14px;
        padding-top: 0.5rem;
      }
      .castory-properties__pair {
        display: flex;
        padding: 0.25rem 0;
      }
      .castory-properties__pair--key {
        width: 30%;
        color: gray;
      }
      .castory-properties__pair--value {
        width: 70%;
        padding-left: 0.5rem;
        white-space: break-spaces;
      }
      .castory-page-break {
        display: none;
        flex-direction: column;
        align-items: center;
        margin: 0.25rem 0;
      }
      .castory-page-break__line {
        width: 100%;
        margin: 0.25rem 0;
        border-bottom: solid 1px gray;
      }

      a:link,
      a:visited {
        color: inherit;
      }

      .pr-2 {
        padding-right: 0.5rem;
      }

      .indent-block {
        padding: 0.25rem;
        margin-right: 0.25rem;
        background-color: #0054ff;
      }

      #float-button a {
        color: #fff;
        text-decoration: none;
      }

      @media print {
        .castory-page-break {
          display: flex;
          page-break-after: always;
        }

        .castory-footer {
          margin-bottom: 0;
        }

        .castory-footer__label {
          line-height: 12px;
        }
      }
    </style>
  </head>
  <body>
    <div class="castory-body">
      <div>
        <div class="castory-multi-columns">
          <div class="castory-section">
            <div class="castory-section__title--main">
              <div class="indent-block"></div>
              <span>${exportedTour.projectLocation}</span>
            </div>
            <div class="castory-properties">
              <div class="castory-properties__pair">
                <span class="castory-properties__pair--key">Reported by</span>
                <span class="castory-properties__pair--value"
                  >${exportedTour.reportedBy}</span
                >
              </div>
              <div class="castory-properties__pair">
                <span class="castory-properties__pair--key">Reported at</span>
                <span class="castory-properties__pair--value">${
                  exportedTour.reportedAt
                }</span>
              </div>
            </div>
          </div>

          <div class="castory-section">
            <div class="castory-section__title--main">
              <br/>
            </div>
            <div class="castory-properties">
              <div class="castory-properties__pair">
                <span class="castory-properties__pair--key">Number of reported tasks</span>
                <span class="castory-properties__pair--value"
                  >${exportedTour.numberOfOpenTasks}</span
                >
              </div>
            </div>
          </div>
        </div>
        <div class="castory-page-break">
          <div class="castory-page-break__line"></div>
        </div>
      </div>
      ${generateHtmlTourSection(exportedTour.tourUrl)}
      ${generateHtmlPlanSection(exportedTour.planUrl)}
    </div>
  </body>
</html>
`;

const exportReportHtml = (exportedTour: ExportedTour) => {
  const htmlContent = generateHtmlReportContent(exportedTour);
  const exportData = new Blob([htmlContent], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(exportData, "tour_report.html");
};

const exportBase64Image = async (base64Url: string) => {
  try {
    const res = await fetch(base64Url);
    const imageBlob: Blob = await res.blob();
    saveAs(imageBlob, "Castory-Image.png");
  } catch (e: any) {
    throw e;
  }
};

async function fetchFileWithFallback(fileUrl: string) {
  // Try fetching with ".jpg" first
  try {
    let response = await fetch(fileUrl);

    // If the response is successful, return it
    if (response.ok) {
      return response;
    }

    // If the first fetch fails, try with ".JPG"
    const fileUrlWithCaps = fileUrl.replace(".jpg", ".JPG");
    response = await fetch(fileUrlWithCaps);

    // If the response with ".JPG" is successful, return it
    if (response.ok) {
      return response;
    }

    // If both ".jpg" and ".JPG" fail, try with ".jpeg"
    const fileUrlWithJpeg = fileUrl.replace(".jpg", ".jpeg");
    response = await fetch(fileUrlWithJpeg);

    // If the response with ".jpeg" is successful, return it
    if (response.ok) {
      return response;
    }

    // If all attempts fail, throw an error
    throw new Error("File not found with .jpg, .JPG, or .jpeg extensions.");
  } catch (error) {
    console.error("Error fetching file:", error);
    return null;
  }
}

async function downloadFile(currentFileName: string) {
  const downloadFile = currentFileName.replace(".dzi", ".jpg");

  const response = await fetchFileWithFallback(downloadFile);

  if (response) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const parts = currentFileName.split("/");
    const fileNameWithExtension = parts[parts.length - 1].replace(
      ".dzi",
      ".jpg"
    );
    const fileNameWithoutExtension = fileNameWithExtension.split(".")[0];

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileNameWithoutExtension}.jpg`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    console.error("Failed to download the file.");
  }
}

export { exportReportHtml, exportBase64Image, downloadFile };
