import { ILocation } from '../interfaces/general'
import moment from 'moment';
export const formatFecha:string = "DD/MM/YYYY HH:mm:ss";

export function getStrFecha({ date = new Date() }: { date: string | Date }): string {
  let newDate: string = "";
  if (typeof date === "string") {
      newDate = moment(date, formatFecha).utc().utcOffset("-04:00").format(formatFecha);
  }
  if (date instanceof Date) {
      newDate = moment(date).utc().utcOffset("-04:00").format(formatFecha);
  }
  return newDate;
}

export function getFecha( date : Date | string): Date {
  let newDate: Date = new Date();
  if (typeof date === "string") {
      newDate = moment(date, formatFecha).utc().utcOffset("-04:00").toDate();
  }
  if (date instanceof Date) {
      newDate = moment(date).utc().utcOffset("-04:00").toDate();
  }
  return newDate;
}

export const formatDateTime = (fecha: string | undefined): string => {
  if (fecha !== undefined) {
    var date = new Date(fecha);
    var dateStr = ("00" + date.getDate()).slice(-2) + "/" +
      ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
      date.getFullYear() + " " +
      ("00" + date.getHours()).slice(-2) + ":" +
      ("00" + date.getMinutes()).slice(-2) + ":" +
      ("00" + date.getSeconds()).slice(-2);
    return dateStr;
  }
  return "";
}

export const formatDate = (fecha: string | undefined): string => {
  if (fecha !== undefined) {
    var date = new Date(fecha);
    var dateStr = ("00" + date.getDate()).slice(-2) + "/" +
      ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
      date.getFullYear();
    return dateStr;
  }
  return "";
}

