package br.jus.tre_pa.sof.umari.datafilter.utils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class TemporalUtils {

	public static boolean isValid(Object dateObj) {
		if (!(dateObj instanceof String))
			return false;
		try {
			if (dateObj.toString().length() == 10)
				LocalDate.parse(dateObj.toString(), DateTimeFormatter.ISO_LOCAL_DATE);
			else
				LocalDateTime.parse(dateObj.toString(), DateTimeFormatter.ISO_LOCAL_DATE_TIME);
		} catch (DateTimeParseException e) {
			return false;
		}
		return true;
	}

	public static LocalDate parseToLocalDate(Object dateObj) {
		if (!(dateObj instanceof String))
			throw new RuntimeException("Formato inválido de Data");
		try {
			if (dateObj.toString().length() == 10)
				return LocalDate.parse(dateObj.toString(), DateTimeFormatter.ISO_LOCAL_DATE);
			return LocalDate.parse(dateObj.toString(), DateTimeFormatter.ISO_LOCAL_DATE_TIME);
		} catch (DateTimeParseException e) {
			throw new RuntimeException("Formato inválido de Data (?)");
		}

	}

	public static LocalDateTime parseToLocalDateTime(Object dateObj) {
		if (!(dateObj instanceof String))
			throw new RuntimeException("Formato inválido de Data");
		try {
			if (dateObj.toString().length() == 10)
				return LocalDateTime.parse(dateObj.toString(), DateTimeFormatter.ISO_LOCAL_DATE);
			return LocalDateTime.parse(dateObj.toString(), DateTimeFormatter.ISO_LOCAL_DATE_TIME);
		} catch (DateTimeParseException e) {
			throw new RuntimeException("Formato inválido de Data");
		}

	}

}
