import { uuid } from 'uuidv4';
import { getDate, getMonth, getYear, isEqual } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import FindAllInDayProviderDTO from '@modules/appointments/dtos/FindAllInDayProviderDTO';

import Appointment from '../../infra/typeorm/entities/Appointment';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';

class FakeAppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findApointment = this.appointments.find(
      appointment => isEqual(appointment.date, date)
    );

    return findApointment;
  }


  public async findAllInMonthFromProvider({ month, provider_id, year }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment => {
      return (
      appointment.provider_id === provider_id &&
      getMonth(appointment.date) +1 === month &&
      getYear(appointment.date) === year
      );
    });

    return appointments;
  }

  public async findAllInDayFromProvider({ day ,month, provider_id, year }: FindAllInDayProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment => {
      return (
      appointment.provider_id === provider_id &&
      getDate(appointment.date) === day &&
      getMonth(appointment.date) +1 === month &&
      getYear(appointment.date) === year
      );
    });

    return appointments;
  }

  public async create({ provider_id, date}:ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, provider_id})

    this.appointments.push(appointment);

    return appointment;
  }
}

export default FakeAppointmentsRepository;
