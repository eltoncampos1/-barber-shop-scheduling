import Appointment from "../infra/typeorm/entities/Appointment";
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '../dtos/IFindAllInMonthFromProviderDTO';
import FindAllInDayProviderDTO from '../dtos/FindAllInDayProviderDTO';

export default interface IAppointmentsRepository {
  create(data : ICreateAppointmentDTO):Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findAllInMonthFromProvider( data: IFindAllInMonthFromProviderDTO ): Promise<Appointment[]>;
  findAllInDayFromProvider( data: FindAllInDayProviderDTO): Promise<Appointment[]>;
};

