import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    marginHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  monthText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  section: {
    backgroundColor: '#e0ffcc',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSheetContent: {
    flex: 1,
    alignItems: 'center',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  dayContainer: {
    alignItems: 'center',
  },
  day: {
    fontSize: 16,
    color: 'black',
  },
  dayText: {
    fontSize: 12,
    color: 'grey',
  },
  selectedDay: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
  selectedDayText: {
    fontSize: 12,
    color: 'green',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  }
});