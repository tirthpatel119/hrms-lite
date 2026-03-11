from rest_framework import serializers
from .models import Employee, Attendance

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    employee_id = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(), source='employee', write_only=True
    )
    employee = EmployeeSerializer(read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'employee', 'employee_id', 'date', 'status']
        
    def validate(self, data):
        # Additional validation if date is in the future maybe (optional)
        return data
