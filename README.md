# Klientownik - Aplikacja Desktopowa do Zarządzania Relacjami z Klientami

## Opis Projektu

**Klientownik** to intuicyjna, lokalna aplikacja desktopowa zaprojektowana do efektywnego zarządzania bazą klientów i notatek. Program ten stanowi wersję demonstracyjną darmowego narzędzia, które planuję udostępniać na moich mediach społecznościowych, aby wspierać małe firmy i osoby prowadzące jednoosobową działalność gospodarczą w organizacji ich danych klientów.

Aplikacja ma na celu uproszczenie codziennych operacji związanych z zarządzaniem kontaktami, umożliwiając szybki dostęp do kluczowych informacji o klientach oraz do ich historii komunikacji poprzez system notatek. Jest to projekt typu **open-source**, którego rozwój jest otwarty na wkład społeczności. Program napisany z pomocą Copilot

## Pliki projektu
- **main.js**: Główny punkt wejścia aplikacji Electron. Tworzy główne okno i ustawia IPC (Inter-Process Communication) do obsługi operacji na klientach i notatkach.
- **database.js**: Obsługuje operacje na bazie danych. Łączy się z bazą danych SQLite i zapewnia funkcje do dodawania, pobierania, aktualizowania i usuwania klientów oraz notatek.
- **index.html**: Główny plik HTML aplikacji. Zawiera strukturę interfejsu użytkownika, w tym sekcje dla klientów i notatek oraz modal do dodawania lub edytowania klientów.
- **renderer.js**: Zarządza interakcjami interfejsu użytkownika. Obsługuje przesyłanie formularzy, operacje modalne i komunikuje się z procesem głównym za pomocą IPC w celu wykonania operacji na bazie danych.
- **style.css**: Zawiera style dla aplikacji, definiując układ i wygląd elementów interfejsu użytkownika.
- **package.json**: Plik konfiguracyjny dla npm. Zawiera listę zależności, skryptów i metadanych dla projektu.

## Technologie

Projekt został zbudowany przy użyciu następujących technologii:

* **Electron.js:** Do tworzenia wieloplatformowej aplikacji desktopowej z użyciem technologii webowych.
* **JavaScript:** Główny język programowania dla logiki aplikacji (proces główny i renderer).
* **HTML5:** Struktura i zawartość interfejsu użytkownika.
* **CSS3:** Stylizacja i wygląd aplikacji.
* **SQLite3:** Lekka, bezserwerowa baza danych SQL do lokalnego przechowywania danych.

## Instalacja
1. Sklonuj repozytorium lub pobierz pliki projektu.
2. Otwórz terminal i przejdź do katalogu projektu.
3. Zainstaluj zależności, uruchamiając:
   ```
   npm install
   ```
4. Uruchom aplikację, używając polecenia:
   ```
   npm start
   ```

## Użycie
- Aby dodać klienta, kliknij przycisk "+ Dodaj klienta" i wypełnij formularz.
- Aby edytować klienta, wybierz klienta z listy i kliknij przycisk edycji.
- Aby usunąć klienta, kliknij przycisk usuwania obok klienta.
- Notatki można dodawać, edytować i usuwać w podobny sposób.

## Wymagania
- Node.js
- Electron
- SQLite

## Licencja
Projekt jest dostępny na licencji MIT.
