import Report from '../model/Report';

import { Request, Response } from 'express';

const addReport = async (req: Request, res: Response) => {
    const owner = req.body.owner;
    const reason = req.body.reason;
    const reported = req.body.reported;
    const type = req.body.type;
    const date = req.body.date;
    console.log(owner);
    console.log(reason);
    console.log(reported);
    console.log(type);
    console.log(date);

    const newReport = new Report({
		owner,
        reported,
        reason,
        date,
        type
        
	});
    await newReport.save( (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json({ status: 'Report saved' });
    });
}

const getReports = async (req: Request, res: Response) => {
    const reports = await Report.find();
    res.json(reports);
}

const getReport = async (req: Request, res: Response) => {
    const report = await Report.findById(req.params.id_report);
    if (!report) {
        return res.status(404).send('The report does not exist');
    }
    res.json(report);
}

const deleteReport = async (req: Request, res: Response) => {
    try {
		await Report.findByIdAndRemove(req.params.id);
        res.status(200).json({ status: 'Report deleted' });
    }
    catch (error) {
        res.status(500).json({message: 'Report not found', error });
    }
}

export default { 
    addReport, 
    getReports, 
    getReport,
    deleteReport
};