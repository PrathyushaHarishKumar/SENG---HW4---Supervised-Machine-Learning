const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, LevelFormat
} = require("docx");

const baseDir = path.join("C:", "Users", "prath", "OneDrive", "Desktop", "Desktop Folders",
  "UMBC Masters Courses", "Spring 2026", "SENG AI Agent Compting", "HW4");

// Load images
const partAImg = fs.readFileSync(path.join(baseDir, "part_a_analysis.png"));
const confMatImg = fs.readFileSync(path.join(baseDir, "confusion_matrices.png"));
const modelCompImg = fs.readFileSync(path.join(baseDir, "model_comparison.png"));
const featImpImg = fs.readFileSync(path.join(baseDir, "feature_importance.png"));
const decTreeImg = fs.readFileSync(path.join(baseDir, "decision_tree.png"));

// Table styling helpers
const border = { style: BorderStyle.SINGLE, size: 1, color: "999999" };
const borders = { top: border, bottom: border, left: border, right: border };
const headerShading = { fill: "1F4E79", type: ShadingType.CLEAR };
const altShading = { fill: "F2F7FB", type: ShadingType.CLEAR };
const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };

function headerCell(text, width) {
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    shading: headerShading, margins: cellMargins,
    children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, bold: true, font: "Arial", size: 20, color: "FFFFFF" })] })]
  });
}

function cell(text, width, shading, opts = {}) {
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    shading: shading || undefined, margins: cellMargins,
    children: [new Paragraph({ alignment: opts.align || AlignmentType.LEFT,
      children: [new TextRun({ text, font: "Arial", size: 20, bold: opts.bold || false })] })]
  });
}

function numCell(text, width, shading) {
  return cell(text, width, shading, { align: AlignmentType.CENTER });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "1F4E79" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 23, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [
        { level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        { level: 1, format: LevelFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1440, hanging: 360 } } } }
      ]},
      { reference: "numbers", levels: [
        { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }
      ]},
    ]
  },
  sections: [
    // ==================== TITLE PAGE ====================
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children: [
        new Paragraph({ spacing: { before: 3000 }, alignment: AlignmentType.CENTER, children: [] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
          children: [new TextRun({ text: "SENG 691 AI Agent Computing", font: "Arial", size: 36, bold: true, color: "1F4E79" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 },
          children: [new TextRun({ text: "Assignment 4: Supervised Machine Learning", font: "Arial", size: 30, bold: true, color: "2E75B6" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 8 } },
          children: [new TextRun({ text: "Sound Data Analysis from UMBC Campus Locations", font: "Arial", size: 24, italics: true, color: "444444" })] }),
        new Paragraph({ spacing: { before: 600 }, alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Prathyusha", font: "Arial", size: 26, bold: true })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
          children: [new TextRun({ text: "University of Maryland, Baltimore County", font: "Arial", size: 22 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
          children: [new TextRun({ text: "Spring 2026", font: "Arial", size: 22 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
          children: [new TextRun({ text: "Date: March 30, 2026", font: "Arial", size: 22 })] }),
      ]
    },

    // ==================== MAIN CONTENT ====================
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      headers: {
        default: new Header({ children: [
          new Paragraph({ alignment: AlignmentType.RIGHT,
            border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "2E75B6", space: 4 } },
            children: [new TextRun({ text: "SENG 691 - Assignment 4: Supervised Machine Learning", font: "Arial", size: 16, italics: true, color: "888888" })] })
        ]})
      },
      footers: {
        default: new Footer({ children: [
          new Paragraph({ alignment: AlignmentType.CENTER,
            border: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC", space: 4 } },
            children: [
              new TextRun({ text: "Prathyusha | UMBC | Page ", font: "Arial", size: 16, color: "888888" }),
              new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "888888" })
            ] })
        ]})
      },
      children: [
        // ==================== TABLE OF CONTENTS ====================
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Table of Contents")] }),
        new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "1. Introduction and Objective", size: 22 })] }),
        new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "2. Part A: Data Collection and Analysis", size: 22 })] }),
        new Paragraph({ spacing: { after: 80 }, indent: { left: 360 }, children: [new TextRun({ text: "2.1 Data Collection Methodology", size: 20 })] }),
        new Paragraph({ spacing: { after: 80 }, indent: { left: 360 }, children: [new TextRun({ text: "2.2 Data Quality Assessment", size: 20 })] }),
        new Paragraph({ spacing: { after: 80 }, indent: { left: 360 }, children: [new TextRun({ text: "2.3 Statistical Summary by Location", size: 20 })] }),
        new Paragraph({ spacing: { after: 80 }, indent: { left: 360 }, children: [new TextRun({ text: "2.4 Patterns and Observations", size: 20 })] }),
        new Paragraph({ spacing: { after: 80 }, indent: { left: 360 }, children: [new TextRun({ text: "2.5 Visualizations", size: 20 })] }),
        new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "3. Part B: Machine Learning Classification", size: 22 })] }),
        new Paragraph({ spacing: { after: 80 }, indent: { left: 360 }, children: [new TextRun({ text: "3.1 Feature Engineering", size: 20 })] }),
        new Paragraph({ spacing: { after: 80 }, indent: { left: 360 }, children: [new TextRun({ text: "3.2 Classification Setup", size: 20 })] }),
        new Paragraph({ spacing: { after: 80 }, indent: { left: 360 }, children: [new TextRun({ text: "3.3 Model 1: Decision Tree", size: 20 })] }),
        new Paragraph({ spacing: { after: 80 }, indent: { left: 360 }, children: [new TextRun({ text: "3.4 Model 2: Random Forest", size: 20 })] }),
        new Paragraph({ spacing: { after: 80 }, indent: { left: 360 }, children: [new TextRun({ text: "3.5 Model 3: Support Vector Machine (SVM)", size: 20 })] }),
        new Paragraph({ spacing: { after: 80 }, indent: { left: 360 }, children: [new TextRun({ text: "3.6 Model Performance Comparison", size: 20 })] }),
        new Paragraph({ spacing: { after: 80 }, indent: { left: 360 }, children: [new TextRun({ text: "3.7 Feature Importance Analysis", size: 20 })] }),
        new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "4. Results and Discussion", size: 22 })] }),
        new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "5. Conclusion", size: 22 })] }),
        new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "6. Tools and Technologies Used", size: 22 })] }),

        new Paragraph({ children: [new PageBreak()] }),

        // ==================== 1. INTRODUCTION ====================
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Introduction and Objective")] }),
        new Paragraph({ spacing: { after: 120 }, children: [
          new TextRun("This assignment focuses on applying supervised machine learning techniques to analyze real-world sound data collected from various locations on the University of Maryland, Baltimore County (UMBC) campus. The objective is to collect noise level measurements in decibels (dBA) using a mobile application, preprocess the data, engineer relevant features, and implement machine learning algorithms for classification and analysis.")
        ]}),
        new Paragraph({ spacing: { after: 120 }, children: [
          new TextRun("The goal is to train classifiers that can predict the campus location based on acoustic characteristics of the environment. This involves collecting data from 4 distinct campus locations, creating meaningful features, and applying 3 different ML algorithms to classify the sound data.")
        ]}),

        new Paragraph({ children: [new PageBreak()] }),

        // ==================== 2. PART A ====================
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. Part A: Data Collection and Analysis")] }),

        // 2.1 Data Collection
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.1 Data Collection Methodology")] }),
        new Paragraph({ spacing: { after: 120 }, children: [
          new TextRun({ text: "Tool Used: ", bold: true }),
          new TextRun("Decibel X \u2013 A professional-grade sound level meter mobile application that measures ambient sound levels in decibels (dBA, A-weighted). The app records continuous readings at approximately 5 samples per second.")
        ]}),
        new Paragraph({ spacing: { after: 120 }, children: [
          new TextRun({ text: "Collection Date: ", bold: true }),
          new TextRun("March 30, 2026 (Sunday afternoon)")
        ]}),
        new Paragraph({ spacing: { after: 120 }, children: [
          new TextRun({ text: "Procedure:", bold: true })
        ]}),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 },
          children: [new TextRun("Downloaded and calibrated the Decibel X app on a smartphone.")] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 },
          children: [new TextRun("Visited each of the 4 UMBC campus locations sequentially.")] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 },
          children: [new TextRun("At each location, started a recording session and collected continuous decibel readings for approximately 30 seconds.")] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 },
          children: [new TextRun("Maintained 5\u201310 minute gaps between recordings at different locations for stabilization.")] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 120 },
          children: [new TextRun("Exported each recording as a CSV file from the Decibel X app.")] }),

        new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "Locations and Data Summary:", bold: true })] }),
        // Locations table
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [400, 2200, 1200, 2560, 1000, 1000],
          rows: [
            new TableRow({ children: [
              headerCell("#", 400), headerCell("Location", 2200), headerCell("Type", 1200),
              headerCell("Date & Time", 2560), headerCell("Readings", 1000), headerCell("Avg dBA", 1000)
            ]}),
            new TableRow({ children: [
              numCell("1", 400), cell("RAC (Retriever Activities Center)", 2200), numCell("Indoor", 1200),
              cell("2026-03-30, 4:54\u20134:57 PM", 2560), numCell("142", 1000), numCell("63.55", 1000)
            ]}),
            new TableRow({ children: [
              numCell("2", 400, altShading), cell("University Center", 2200, altShading), numCell("Indoor", 1200, altShading),
              cell("2026-03-30, 5:08\u20135:09 PM", 2560, altShading), numCell("142", 1000, altShading), numCell("71.21", 1000, altShading)
            ]}),
            new TableRow({ children: [
              numCell("3", 400), cell("Library (Albin O. Kuhn)", 2200), numCell("Indoor", 1200),
              cell("2026-03-30, 5:18\u20135:19 PM", 2560), numCell("142", 1000), numCell("50.74", 1000)
            ]}),
            new TableRow({ children: [
              numCell("4", 400, altShading), cell("Commons", 2200, altShading), numCell("Outdoor", 1200, altShading),
              cell("2026-03-30, 5:26\u20135:27 PM", 2560, altShading), numCell("112", 1000, altShading), numCell("65.71", 1000, altShading)
            ]}),
          ]
        }),
        new Paragraph({ spacing: { before: 120, after: 120 }, children: [
          new TextRun({ text: "Total data points: 538", bold: true }),
          new TextRun(" (exceeds the 250\u2013300 minimum requirement)")
        ]}),

        // 2.2 Data Quality
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.2 Data Quality Assessment")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: "Missing values: ", bold: true }), new TextRun("0 (all columns fully populated)")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: "Duplicate rows: ", bold: true }), new TextRun("0")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: "Outliers: ", bold: true }), new TextRun("0 outliers detected using IQR method (bounds: [30.2, 93.1] dBA)")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: "Data types: ", bold: true }), new TextRun("All correct (float64 for decibel, datetime for timestamp, string for location)")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 120 },
          children: [new TextRun({ text: "Decibel range: ", bold: true }), new TextRun("46.6 \u2013 79.6 dBA across all locations")] }),
        new Paragraph({ spacing: { after: 120 }, children: [
          new TextRun({ text: "Conclusion: ", bold: true, italics: true }),
          new TextRun({ text: "The dataset is clean and ready for analysis with no preprocessing required.", italics: true })
        ]}),

        // 2.3 Statistical Summary
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.3 Statistical Summary by Location")] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2200, 1000, 1200, 1200, 1060, 1060, 1640],
          rows: [
            new TableRow({ children: [
              headerCell("Location", 2200), headerCell("Count", 1000), headerCell("Mean (dBA)", 1200),
              headerCell("Std Dev", 1200), headerCell("Min", 1060), headerCell("Max", 1060), headerCell("Median", 1640)
            ]}),
            new TableRow({ children: [
              cell("Library", 2200), numCell("142", 1000), numCell("50.74", 1200),
              numCell("2.19", 1200), numCell("46.6", 1060), numCell("62.3", 1060), numCell("50.45", 1640)
            ]}),
            new TableRow({ children: [
              cell("RAC", 2200, altShading), numCell("142", 1000, altShading), numCell("63.55", 1200, altShading),
              numCell("3.05", 1200, altShading), numCell("57.2", 1060, altShading), numCell("74.5", 1060, altShading), numCell("63.40", 1640, altShading)
            ]}),
            new TableRow({ children: [
              cell("Commons", 2200), numCell("112", 1000), numCell("65.71", 1200),
              numCell("5.15", 1200), numCell("52.0", 1060), numCell("75.6", 1060), numCell("66.00", 1640)
            ]}),
            new TableRow({ children: [
              cell("University Center", 2200, altShading), numCell("142", 1000, altShading), numCell("71.21", 1200, altShading),
              numCell("3.11", 1200, altShading), numCell("63.6", 1060, altShading), numCell("79.6", 1060, altShading), numCell("71.10", 1640, altShading)
            ]}),
          ]
        }),

        // 2.4 Patterns
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.4 Patterns and Observations")] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 },
          children: [
            new TextRun({ text: "Library is the quietest location ", bold: true }),
            new TextRun("(Avg 50.74 dBA) \u2013 consistent with a study environment. Very low variance (std = 2.19), indicating stable, quiet conditions.")
          ]}),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 },
          children: [
            new TextRun({ text: "University Center is the loudest ", bold: true }),
            new TextRun("(Avg 71.21 dBA) \u2013 this is a social gathering area with food courts and student activity, explaining the higher noise levels.")
          ]}),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 },
          children: [
            new TextRun({ text: "RAC has moderate noise ", bold: true }),
            new TextRun("(Avg 63.55 dBA) \u2013 indoor athletic/activity center with moderate ambient noise.")
          ]}),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 },
          children: [
            new TextRun({ text: "Commons has the highest variability ", bold: true }),
            new TextRun("(Std = 5.15 dBA) \u2013 being an outdoor location, sound fluctuates more due to wind, passing people, and environmental factors. Range spans from 52.0 to 75.6 dBA.")
          ]}),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 },
          children: [
            new TextRun({ text: "Clear separation between Library and other locations ", bold: true }),
            new TextRun("\u2013 The Library\u2019s max (62.3 dBA) barely overlaps with the minimum of other indoor locations, making it highly distinguishable.")
          ]}),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 120 },
          children: [
            new TextRun({ text: "Overlap between RAC and Commons ", bold: true }),
            new TextRun("\u2013 These two locations have overlapping decibel ranges (RAC: 57.2\u201374.5, Commons: 52.0\u201375.6), creating a classification challenge.")
          ]}),

        // 2.5 Visualizations
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.5 Visualizations")] }),
        new Paragraph({ spacing: { after: 80 }, children: [
          new TextRun({ text: "Figure 1: ", bold: true, italics: true }),
          new TextRun({ text: "Sound Level Analysis \u2013 Box Plot, Histogram, Bar Chart, and Violin Plot", italics: true })
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [
          new ImageRun({ type: "png", data: partAImg, transformation: { width: 580, height: 414 },
            altText: { title: "Part A Analysis", description: "Sound level distribution plots", name: "part_a" } })
        ]}),

        new Paragraph({ children: [new PageBreak()] }),

        // ==================== 3. PART B ====================
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. Part B: Machine Learning Classification")] }),

        // 3.1 Feature Engineering
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.1 Feature Engineering")] }),
        new Paragraph({ spacing: { after: 120 }, children: [
          new TextRun("We created multiple meaningful features from the raw dataset to capture different aspects of the acoustic environment:")
        ]}),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [400, 2100, 1500, 4360],
          rows: [
            new TableRow({ children: [
              headerCell("#", 400), headerCell("Feature", 2100), headerCell("Type", 1500), headerCell("Description", 4360)
            ]}),
            new TableRow({ children: [
              numCell("1", 400), cell("hour", 2100), cell("Time-based", 1500), cell("Hour of the day (16\u201317)", 4360)
            ]}),
            new TableRow({ children: [
              numCell("2", 400, altShading), cell("minute", 2100, altShading), cell("Time-based", 1500, altShading), cell("Minute of the hour", 4360, altShading)
            ]}),
            new TableRow({ children: [
              numCell("3", 400), cell("second", 2100), cell("Time-based", 1500), cell("Second of measurement", 4360)
            ]}),
            new TableRow({ children: [
              numCell("4", 400, altShading), cell("is_indoor", 2100, altShading), cell("Location-based", 1500, altShading), cell("Indoor (1) or Outdoor (0)", 4360, altShading)
            ]}),
            new TableRow({ children: [
              numCell("5", 400), cell("noise_category", 2100), cell("Noise-level", 1500), cell("Quiet (<55), Moderate (55-65), Loud (65-75), Very Loud (>75)", 4360)
            ]}),
            new TableRow({ children: [
              numCell("6", 400, altShading), cell("noise_level_encoded", 2100, altShading), cell("Noise-level", 1500, altShading), cell("Ordinal encoding: Quiet=0, Moderate=1, Loud=2, Very Loud=3", 4360, altShading)
            ]}),
            new TableRow({ children: [
              numCell("7", 400), cell("rolling_mean", 2100), cell("Statistical", 1500), cell("5-sample rolling average of decibel values per location", 4360)
            ]}),
            new TableRow({ children: [
              numCell("8", 400, altShading), cell("rolling_std", 2100, altShading), cell("Statistical", 1500, altShading), cell("5-sample rolling standard deviation per location", 4360, altShading)
            ]}),
            new TableRow({ children: [
              numCell("9", 400), cell("deviation_from_mean", 2100), cell("Statistical", 1500), cell("How far each reading deviates from its location mean", 4360)
            ]}),
          ]
        }),
        new Paragraph({ spacing: { before: 120, after: 80 }, children: [
          new TextRun({ text: "Features used for ML classification: ", bold: true }),
          new TextRun("decibel, rolling_mean, rolling_std, deviation_from_mean, noise_level_encoded")
        ]}),
        new Paragraph({ spacing: { after: 120 }, children: [
          new TextRun({ text: "Rationale: ", bold: true }),
          new TextRun("We used sound-based features rather than raw time features (hour/minute) because time features would trivially identify the recording session and leak location identity. Sound-based features test whether the models can genuinely classify locations based on acoustic characteristics.")
        ]}),

        // 3.2 Classification Setup
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.2 Classification Setup")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: "Classification type: ", bold: true }), new TextRun("Multi-class (4 classes: RAC, University Center, Library, Commons)")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: "Target variable: ", bold: true }), new TextRun("Location name (label-encoded as 0, 1, 2, 3)")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: "Train/Test split: ", bold: true }), new TextRun("80% training (430 samples), 20% testing (108 samples)")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: "Stratification: ", bold: true }), new TextRun("Yes (ensures proportional class representation in both sets)")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 120 },
          children: [new TextRun({ text: "Feature scaling: ", bold: true }), new TextRun("StandardScaler applied for SVM (required for distance-based algorithms)")] }),

        // 3.3 Decision Tree
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.3 Model 1: Decision Tree Classifier")] }),
        new Paragraph({ spacing: { after: 80 }, children: [
          new TextRun({ text: "Algorithm: ", bold: true }), new TextRun("CART (Classification and Regression Trees)")
        ]}),
        new Paragraph({ spacing: { after: 80 }, children: [
          new TextRun({ text: "Hyperparameters: ", bold: true }), new TextRun("max_depth=10, min_samples_split=5, random_state=42")
        ]}),
        new Paragraph({ spacing: { after: 80 }, children: [
          new TextRun({ text: "How it works: ", bold: true }),
          new TextRun("Recursively splits the data using feature thresholds to create decision rules. At each node, it selects the feature and threshold that best separates the classes (using Gini impurity). Each leaf node represents a class prediction.")
        ]}),
        new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Results:", bold: true })] }),
        new Table({
          width: { size: 5000, type: WidthType.DXA },
          columnWidths: [2500, 2500],
          rows: [
            new TableRow({ children: [headerCell("Metric", 2500), headerCell("Score", 2500)] }),
            new TableRow({ children: [cell("Accuracy", 2500), numCell("0.8426 (84.26%)", 2500)] }),
            new TableRow({ children: [cell("Precision", 2500, altShading), numCell("0.8610 (86.10%)", 2500, altShading)] }),
            new TableRow({ children: [cell("Recall", 2500), numCell("0.8426 (84.26%)", 2500)] }),
            new TableRow({ children: [cell("F1-Score", 2500, altShading), numCell("0.8471 (84.71%)", 2500, altShading)] }),
          ]
        }),
        new Paragraph({ spacing: { before: 100, after: 80 }, children: [
          new TextRun({ text: "Per-class breakdown: ", bold: true }),
          new TextRun("Library achieved 100% across all metrics. Commons was hardest to classify (F1=0.67) due to overlap with RAC (F1=0.75). University Center performed well (F1=0.93).")
        ]}),

        // 3.4 Random Forest
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.4 Model 2: Random Forest Classifier")] }),
        new Paragraph({ spacing: { after: 80 }, children: [
          new TextRun({ text: "Algorithm: ", bold: true }), new TextRun("Ensemble of 100 decision trees with bagging")
        ]}),
        new Paragraph({ spacing: { after: 80 }, children: [
          new TextRun({ text: "Hyperparameters: ", bold: true }), new TextRun("n_estimators=100, max_depth=15, min_samples_split=5, random_state=42")
        ]}),
        new Paragraph({ spacing: { after: 80 }, children: [
          new TextRun({ text: "How it works: ", bold: true }),
          new TextRun("Trains multiple decision trees on random subsets of data and features (bootstrap aggregation), then aggregates predictions via majority voting. This reduces overfitting and improves generalization compared to a single decision tree.")
        ]}),
        new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Results:", bold: true })] }),
        new Table({
          width: { size: 5000, type: WidthType.DXA },
          columnWidths: [2500, 2500],
          rows: [
            new TableRow({ children: [headerCell("Metric", 2500), headerCell("Score", 2500)] }),
            new TableRow({ children: [cell("Accuracy", 2500), numCell("0.9352 (93.52%)", 2500)] }),
            new TableRow({ children: [cell("Precision", 2500, altShading), numCell("0.9363 (93.63%)", 2500, altShading)] }),
            new TableRow({ children: [cell("Recall", 2500), numCell("0.9352 (93.52%)", 2500)] }),
            new TableRow({ children: [cell("F1-Score", 2500, altShading), numCell("0.9353 (93.53%)", 2500, altShading)] }),
          ]
        }),
        new Paragraph({ spacing: { before: 100, after: 80 }, children: [
          new TextRun({ text: "Improvement over Decision Tree: ", bold: true }),
          new TextRun("~9% improvement in accuracy. The ensemble approach reduced misclassification especially for Commons (F1 improved from 0.67 to 0.84) and RAC (F1 improved from 0.75 to 0.90).")
        ]}),

        // 3.5 SVM
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.5 Model 3: Support Vector Machine (SVM)")] }),
        new Paragraph({ spacing: { after: 80 }, children: [
          new TextRun({ text: "Algorithm: ", bold: true }), new TextRun("SVM with RBF (Radial Basis Function) kernel")
        ]}),
        new Paragraph({ spacing: { after: 80 }, children: [
          new TextRun({ text: "Hyperparameters: ", bold: true }), new TextRun("kernel=\u2018rbf\u2019, C=10, gamma=\u2018scale\u2019, random_state=42")
        ]}),
        new Paragraph({ spacing: { after: 80 }, children: [
          new TextRun({ text: "How it works: ", bold: true }),
          new TextRun("Maps data into a higher-dimensional space using the RBF kernel function and finds optimal hyperplanes that separate classes with maximum margin. The RBF kernel enables non-linear decision boundaries, making it effective for complex classification tasks.")
        ]}),
        new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Results:", bold: true })] }),
        new Table({
          width: { size: 5000, type: WidthType.DXA },
          columnWidths: [2500, 2500],
          rows: [
            new TableRow({ children: [headerCell("Metric", 2500), headerCell("Score", 2500)] }),
            new TableRow({ children: [cell("Accuracy", 2500), numCell("1.0000 (100%)", 2500)] }),
            new TableRow({ children: [cell("Precision", 2500, altShading), numCell("1.0000 (100%)", 2500, altShading)] }),
            new TableRow({ children: [cell("Recall", 2500), numCell("1.0000 (100%)", 2500)] }),
            new TableRow({ children: [cell("F1-Score", 2500, altShading), numCell("1.0000 (100%)", 2500, altShading)] }),
          ]
        }),
        new Paragraph({ spacing: { before: 100, after: 80 }, children: [
          new TextRun({ text: "Key insight: ", bold: true }),
          new TextRun("SVM\u2019s ability to create non-linear decision boundaries with the RBF kernel, combined with feature scaling and regularization (C=10), allowed it to perfectly separate all 4 location classes even where they overlap in individual feature dimensions.")
        ]}),

        new Paragraph({ children: [new PageBreak()] }),

        // 3.6 Model Comparison
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.6 Model Performance Comparison")] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2500, 1715, 1715, 1715, 1715],
          rows: [
            new TableRow({ children: [
              headerCell("Model", 2500), headerCell("Accuracy", 1715), headerCell("Precision", 1715),
              headerCell("Recall", 1715), headerCell("F1-Score", 1715)
            ]}),
            new TableRow({ children: [
              cell("Decision Tree", 2500), numCell("0.8426", 1715), numCell("0.8610", 1715),
              numCell("0.8426", 1715), numCell("0.8471", 1715)
            ]}),
            new TableRow({ children: [
              cell("Random Forest", 2500, altShading), numCell("0.9352", 1715, altShading), numCell("0.9363", 1715, altShading),
              numCell("0.9352", 1715, altShading), numCell("0.9353", 1715, altShading)
            ]}),
            new TableRow({ children: [
              cell("SVM (Best)", 2500, { fill: "D4EDDA", type: ShadingType.CLEAR }),
              numCell("1.0000", 1715, { fill: "D4EDDA", type: ShadingType.CLEAR }),
              numCell("1.0000", 1715, { fill: "D4EDDA", type: ShadingType.CLEAR }),
              numCell("1.0000", 1715, { fill: "D4EDDA", type: ShadingType.CLEAR }),
              numCell("1.0000", 1715, { fill: "D4EDDA", type: ShadingType.CLEAR }),
            ]}),
          ]
        }),
        new Paragraph({ spacing: { before: 200, after: 80 }, children: [
          new TextRun({ text: "Figure 2: ", bold: true, italics: true }),
          new TextRun({ text: "Confusion Matrices for All Three Models", italics: true })
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [
          new ImageRun({ type: "png", data: confMatImg, transformation: { width: 580, height: 161 },
            altText: { title: "Confusion Matrices", description: "Confusion matrices for DT, RF, SVM", name: "conf" } })
        ]}),
        new Paragraph({ spacing: { after: 80 }, children: [
          new TextRun({ text: "Figure 3: ", bold: true, italics: true }),
          new TextRun({ text: "Model Performance Comparison Bar Chart", italics: true })
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [
          new ImageRun({ type: "png", data: modelCompImg, transformation: { width: 480, height: 288 },
            altText: { title: "Model Comparison", description: "Bar chart comparing model metrics", name: "comp" } })
        ]}),

        // 3.7 Feature Importance
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.7 Feature Importance Analysis")] }),
        new Paragraph({ spacing: { after: 80 }, children: [
          new TextRun("From the Random Forest model, the features ranked by importance are:")
        ]}),
        new Table({
          width: { size: 6000, type: WidthType.DXA },
          columnWidths: [600, 2700, 1400, 1300],
          rows: [
            new TableRow({ children: [
              headerCell("Rank", 600), headerCell("Feature", 2700), headerCell("Importance", 1400), headerCell("% Share", 1300)
            ]}),
            new TableRow({ children: [
              numCell("1", 600), cell("rolling_mean", 2700), numCell("0.3669", 1400), numCell("36.7%", 1300)
            ]}),
            new TableRow({ children: [
              numCell("2", 600, altShading), cell("decibel", 2700, altShading), numCell("0.2663", 1400, altShading), numCell("26.6%", 1300, altShading)
            ]}),
            new TableRow({ children: [
              numCell("3", 600), cell("deviation_from_mean", 2700), numCell("0.1580", 1400), numCell("15.8%", 1300)
            ]}),
            new TableRow({ children: [
              numCell("4", 600, altShading), cell("noise_level_encoded", 2700, altShading), numCell("0.1117", 1400, altShading), numCell("11.2%", 1300, altShading)
            ]}),
            new TableRow({ children: [
              numCell("5", 600), cell("rolling_std", 2700), numCell("0.0971", 1400), numCell("9.7%", 1300)
            ]}),
          ]
        }),
        new Paragraph({ spacing: { before: 120, after: 80 }, children: [
          new TextRun({ text: "Figure 4: ", bold: true, italics: true }),
          new TextRun({ text: "Feature Importance (Random Forest)", italics: true })
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [
          new ImageRun({ type: "png", data: featImpImg, transformation: { width: 480, height: 240 },
            altText: { title: "Feature Importance", description: "Random Forest feature importance", name: "feat" } })
        ]}),
        new Paragraph({ spacing: { after: 80 }, children: [
          new TextRun({ text: "Figure 5: ", bold: true, italics: true }),
          new TextRun({ text: "Decision Tree Visualization (Max Depth = 3)", italics: true })
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [
          new ImageRun({ type: "png", data: decTreeImg, transformation: { width: 580, height: 290 },
            altText: { title: "Decision Tree", description: "Decision Tree visualization", name: "tree" } })
        ]}),

        new Paragraph({ children: [new PageBreak()] }),

        // ==================== 4. RESULTS AND DISCUSSION ====================
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("4. Results and Discussion")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 Why SVM Performed Best")] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 },
          children: [
            new TextRun({ text: "Non-linear decision boundaries: ", bold: true }),
            new TextRun("The RBF kernel maps features into a higher-dimensional space, enabling complex separation of overlapping classes like RAC and Commons.")
          ]}),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 },
          children: [
            new TextRun({ text: "Margin maximization: ", bold: true }),
            new TextRun("SVM finds the optimal separating hyperplane with maximum margin, making it robust even when classes overlap in feature space.")
          ]}),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 },
          children: [
            new TextRun({ text: "Feature scaling: ", bold: true }),
            new TextRun("StandardScaler normalization helps SVM treat all features equally, preventing features with larger ranges from dominating.")
          ]}),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 120 },
          children: [
            new TextRun({ text: "Regularization (C=10): ", bold: true }),
            new TextRun("Provides a good balance between maximizing the margin and allowing some misclassification for better generalization.")
          ]}),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.2 Why Decision Tree Performed Worst")] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 },
          children: [
            new TextRun({ text: "Greedy splitting: ", bold: true }),
            new TextRun("Decision trees make greedy, locally optimal splits that may not generalize well to the test set.")
          ]}),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 },
          children: [
            new TextRun({ text: "Difficulty with overlapping classes: ", bold: true }),
            new TextRun("RAC (57.2\u201374.5 dBA) and Commons (52.0\u201375.6 dBA) have significant overlap that a single tree struggles to resolve.")
          ]}),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 120 },
          children: [
            new TextRun({ text: "Axis-aligned boundaries: ", bold: true }),
            new TextRun("A single tree creates axis-aligned decision boundaries, which may not capture the true class separation patterns in the feature space.")
          ]}),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.3 Random Forest as Middle Ground")] }),
        new Paragraph({ spacing: { after: 120 }, children: [
          new TextRun("Random Forest improved significantly over a single Decision Tree (+9.3% accuracy) by leveraging ensemble averaging across 100 trees. The bootstrap aggregation (bagging) approach reduces variance and overfitting. However, it still uses axis-aligned boundaries (unlike SVM\u2019s non-linear kernel), which limits its ability to achieve perfect separation on overlapping classes like RAC vs. Commons.")
        ]}),

        // ==================== 5. CONCLUSION ====================
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("5. Conclusion")] }),
        new Paragraph({ spacing: { after: 120 }, children: [
          new TextRun("This project successfully demonstrated the application of supervised machine learning to classify UMBC campus locations based on their acoustic profiles. Key findings include:")
        ]}),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 },
          children: [new TextRun("Sound levels vary significantly across campus: Library (~51 dBA) is distinctly quiet, University Center (~71 dBA) is the loudest, and RAC (~64 dBA) and Commons (~66 dBA) have moderate overlap.")] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 },
          children: [new TextRun("Feature engineering (rolling statistics, deviation metrics, noise level encoding) significantly improves classification beyond raw decibel values alone.")] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 },
          children: [new TextRun({ text: "SVM with RBF kernel was the best-performing model (100% accuracy)", bold: true }), new TextRun(", followed by Random Forest (93.5%) and Decision Tree (84.3%).")] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 },
          children: [new TextRun("The Library was the easiest location to classify (100% across all models) due to its distinctly low noise levels.")] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 120 },
          children: [new TextRun("Commons and RAC posed the greatest classification challenge due to overlapping decibel ranges, demonstrating the importance of statistical features and advanced ML algorithms.")] }),

        // ==================== 6. TOOLS ====================
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("6. Tools and Technologies Used")] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2500, 6860],
          rows: [
            new TableRow({ children: [headerCell("Category", 2500), headerCell("Tool / Technology", 6860)] }),
            new TableRow({ children: [cell("Data Collection", 2500), cell("Decibel X mobile application", 6860)] }),
            new TableRow({ children: [cell("Programming Language", 2500, altShading), cell("Python 3.x", 6860, altShading)] }),
            new TableRow({ children: [cell("Data Manipulation", 2500), cell("pandas, numpy", 6860)] }),
            new TableRow({ children: [cell("Visualization", 2500, altShading), cell("matplotlib, seaborn", 6860, altShading)] }),
            new TableRow({ children: [cell("Machine Learning", 2500), cell("scikit-learn (DecisionTreeClassifier, RandomForestClassifier, SVC)", 6860)] }),
            new TableRow({ children: [cell("Preprocessing", 2500, altShading), cell("scikit-learn (LabelEncoder, StandardScaler, train_test_split)", 6860, altShading)] }),
            new TableRow({ children: [cell("Evaluation Metrics", 2500), cell("accuracy_score, precision_score, recall_score, f1_score, confusion_matrix", 6860)] }),
          ]
        }),

        new Paragraph({ spacing: { before: 400 },
          border: { top: { style: BorderStyle.SINGLE, size: 2, color: "2E75B6", space: 8 } },
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "End of Report", font: "Arial", size: 20, italics: true, color: "888888" })]
        }),
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  const outPath = path.join(baseDir, "SENG691_HW4_Report.docx");
  fs.writeFileSync(outPath, buffer);
  console.log("Report created: " + outPath);
});
